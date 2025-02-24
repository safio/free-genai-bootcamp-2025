import boto3
import json
import os
from typing import Dict, List, Tuple
import tempfile
import subprocess
from datetime import datetime

class AudioGenerator:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.polly = boto3.client('polly')
        self.model_id = "amazon.nova-micro-v1:0"
        
        # Define French neural voices
        self.voices = {
            'male': 'Remi',
            'female': 'Lea',
            'announcer': 'Remi'  # Default announcer voice
        }
        
        # Create audio output directory
        self.audio_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "frontend/static/audio"
        )
        os.makedirs(self.audio_dir, exist_ok=True)
        
        # Create temp directory for intermediate files
        self.temp_dir = os.path.join(self.audio_dir, "temp")
        os.makedirs(self.temp_dir, exist_ok=True)

    def _invoke_bedrock(self, prompt: str) -> str:
        """Invoke Bedrock with the given prompt using converse API"""
        messages = [{
            "role": "user",
            "content": [{
                "text": prompt
            }]
        }]
        
        try:
            response = self.bedrock.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={
                    "temperature": 0,
                    "topP": 0.95,
                    "maxTokens": 2000
                }
            )
            return response['output']['message']['content'][0]['text']
        except Exception as e:
            print(f"Erreur dans Bedrock converse: {str(e)}")
            raise e

    def validate_conversation_parts(self, parts: List[Tuple[str, str, str, str]]) -> bool:
        """
        Valide que les parties de conversation sont correctement formatées.
        Renvoie True si valide, False sinon.
        """
        if not parts:
            print("Erreur: Aucune partie de conversation générée")
            return False
            
        # Vérifie qu'on a un annonceur pour l'intro
        if not parts[0][0].lower() == 'annonceur':
            print("Erreur: Le premier intervenant doit être un Annonceur")
            return False
            
        # Vérifie que chaque partie a du contenu valide
        for i, (speaker, text, gender, section) in enumerate(parts):
            # Vérifie l'intervenant
            if not speaker or not isinstance(speaker, str):
                print(f"Erreur: Intervenant invalide dans la partie {i+1}")
                return False
                
            # Vérifie le texte
            if not text or not isinstance(text, str):
                print(f"Erreur: Texte invalide dans la partie {i+1}")
                return False
                
            # Vérifie le genre
            if gender not in ['male', 'female']:
                print(f"Erreur: Genre invalide dans la partie {i+1}: {gender}")
                return False
                
            # Vérifie la section
            if section not in ['introduction', 'conversation', 'question']:
                print(f"Erreur: Section invalide dans la partie {i+1}: {section}")
                # Don't return False here, just warn - the section might be worded differently
        
        return True

    def parse_conversation(self, question: Dict) -> List[Tuple[str, str, str, str]]:
        """
        Convertit la question en format pour la génération audio.
        Renvoie une liste de tuples (intervenant, texte, genre, section).
        """
        print(question)
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Demande à Nova de parser la conversation et d'assigner les intervenants et genres
                prompt = f"""
                Vous êtes un générateur de script audio pour des tests d'écoute en français. Formatez la question suivante pour la génération audio.

                Règles:
                1. Introduction et parties de Question:
                   - Doivent commencer par 'Intervenant: Annonceur (Genre: male)'
                   - Garder comme parties séparées
                   - Marquer les sections avec "Section: [Introduction/Conversation/Question]" au début

                2. Parties de conversation:
                   - Nommer les intervenants selon leur rôle (Étudiant, Professeur, etc.)
                   - Doit spécifier le genre EXACTEMENT comme 'Genre: male' ou 'Genre: female'
                   - Utiliser des noms cohérents pour le même intervenant
                   - Diviser les longs discours aux pauses naturelles

                Formatez chaque partie EXACTEMENT comme ceci, sans variations:
                Section: [Introduction/Conversation/Question]
                Intervenant: [nom] (Genre: male)
                Texte: [texte français]
                ---

                Exemple de format:
                Section: Introduction
                Intervenant: Annonceur (Genre: male)
                Texte: Écoutez la conversation suivante et répondez à la question.
                ---
                Section: Conversation
                Intervenant: Étudiant (Genre: female)
                Texte: Excusez-moi, ce train s'arrête-t-il à la gare de Lyon?
                ---
                Section: Question
                Intervenant: Annonceur (Genre: male)
                Texte: Où va le train?
                ---

                Question à formater:
                {json.dumps(question, ensure_ascii=False, indent=2)}

                Produisez UNIQUEMENT les parties formatées dans l'ordre: introduction, conversation, question.
                Assurez-vous de spécifier le genre EXACTEMENT comme indiqué dans l'exemple.
                """
                
                response = self._invoke_bedrock(prompt)
                
                # Analyse la réponse en parties d'intervenant
                parts = []
                current_section = None
                current_speaker = None
                current_gender = None
                current_text = None
                
                # Suivi des intervenants pour maintenir la cohérence des genres
                speaker_genders = {}
                
                for line in response.split('\n'):
                    line = line.strip()
                    if not line:
                        continue
                    
                    if line.startswith('Section:'):
                        current_section = line.split('Section:')[1].strip().lower()
                        
                    elif any(line.startswith(prefix) for prefix in ['Intervenant:', 'Speaker:']):
                        # Sauvegarde la partie précédente si elle existe
                        if current_speaker and current_text:
                            # Ensure section is set
                            if not current_section:
                                if len(parts) == 0:
                                    current_section = 'introduction'
                                else:
                                    current_section = 'conversation'
                            # Ajoute l'info de section au tuple
                            parts.append((current_speaker, current_text, current_gender, current_section))
                        
                        # Analyse le nouvel intervenant et son genre
                        try:
                            if line.startswith('Intervenant:'):
                                speaker_part = line.split('Intervenant:')[1].strip()
                            else:
                                speaker_part = line.split('Speaker:')[1].strip()
                                
                            current_speaker = speaker_part.split('(')[0].strip()
                            
                            # Standardiser les noms d'intervenants en français
                            if current_speaker.lower() == 'announcer':
                                current_speaker = 'Annonceur'
                            elif current_speaker.lower() == 'student':
                                current_speaker = 'Étudiant'
                            elif current_speaker.lower() == 'teacher':
                                current_speaker = 'Professeur'
                            
                            # Extraire le genre
                            if 'Genre:' in speaker_part:
                                gender_part = speaker_part.split('Genre:')[1].split(')')[0].strip().lower()
                            else:
                                gender_part = speaker_part.split('Gender:')[1].split(')')[0].strip().lower()
                            
                            # Normaliser le genre
                            if gender_part in ['male', 'homme', 'masculin', 'm']:
                                current_gender = 'male'
                            elif gender_part in ['female', 'femme', 'féminin', 'f']:
                                current_gender = 'female'
                            else:
                                raise ValueError(f"Format de genre invalide: {gender_part}")
                            
                            # Vérifier la cohérence du genre
                            if current_speaker in speaker_genders:
                                if current_gender != speaker_genders[current_speaker]:
                                    print(f"Avertissement: Incohérence de genre pour {current_speaker}. Utilisation du genre précédemment assigné {speaker_genders[current_speaker]}")
                                current_gender = speaker_genders[current_speaker]
                            else:
                                speaker_genders[current_speaker] = current_gender
                        except Exception as e:
                            print(f"Erreur d'analyse intervenant/genre: {line}")
                            raise e
                            
                    elif any(line.startswith(prefix) for prefix in ['Texte:', 'Text:']):
                        if line.startswith('Texte:'):
                            current_text = line.split('Texte:')[1].strip()
                        else:
                            current_text = line.split('Text:')[1].strip()
                        
                    elif line == '---' and current_speaker and current_text:
                        # Ensure section is set before adding
                        if not current_section:
                            if len(parts) == 0:
                                current_section = 'introduction'
                            else:
                                current_section = 'conversation'
                                
                        parts.append((current_speaker, current_text, current_gender, current_section))
                        current_speaker = None
                        current_gender = None
                        current_text = None
                
                # Ajoute la dernière partie si elle existe
                if current_speaker and current_text:
                    # Ensure section is set
                    if not current_section:
                        if len(parts) == 0:
                            current_section = 'introduction'
                        else:
                            current_section = 'conversation'
                    parts.append((current_speaker, current_text, current_gender, current_section))
                
                # Debugging output
                print("Parsed conversation parts:")
                for part in parts:
                    print(f"  Speaker: {part[0]}, Gender: {part[2]}, Section: {part[3]}")
                    print(f"  Text: {part[1][:50]}...")
                
                # Valide les parties analysées
                if self.validate_conversation_parts(parts):
                    return parts
                    
                print(f"Tentative {attempt + 1}: Format de conversation invalide, nouvelle tentative...")
                
            except Exception as e:
                print(f"Tentative {attempt + 1} échouée: {str(e)}")
                if attempt == max_retries - 1:
                    raise Exception("Échec de l'analyse de la conversation après plusieurs tentatives")
        
        raise Exception("Échec de génération d'un format de conversation valide")

    def get_voice_for_gender(self, gender: str) -> str:
        """Obtient une voix appropriée pour le genre donné"""
        return self.voices[gender]

    def generate_audio_part(self, text: str, voice_name: str, output_file: str = None) -> str:
        """Génère l'audio pour une seule partie en utilisant Amazon Polly"""
        response = self.polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_name,
            Engine='neural',
            LanguageCode='fr-FR'
        )
        
        # Sauvegarde dans un fichier
        if output_file is None:
            with tempfile.NamedTemporaryFile(dir=self.temp_dir, suffix='.mp3', delete=False) as temp_file:
                temp_file.write(response['AudioStream'].read())
                return temp_file.name
        else:
            with open(output_file, 'wb') as f:
                f.write(response['AudioStream'].read())
            return output_file

    def generate_silence(self, duration_ms: int) -> str:
        """Génère un fichier audio silencieux de durée spécifiée"""
        output_file = os.path.join(self.temp_dir, f'silence_{duration_ms}ms.mp3')
        subprocess.run([
            'ffmpeg', '-y', '-f', 'lavfi', '-i',
            f'anullsrc=r=24000:cl=mono:d={duration_ms/1000}',
            '-c:a', 'libmp3lame', '-b:a', '48k',
            output_file
        ], check=True)
        return output_file

    def generate_audio(self, question: Dict) -> str:
        """
        Génère l'audio pour toute la question avec des pauses appropriées entre les sections.
        Renvoie le chemin vers le fichier audio généré.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(self.audio_dir, f"question_{timestamp}.mp3")
        
        try:
            # Nettoie les anciens fichiers temporaires
            for file in os.listdir(self.temp_dir):
                file_path = os.path.join(self.temp_dir, file)
                if os.path.isfile(file_path):
                    try:
                        os.unlink(file_path)
                    except Exception as e:
                        print(f"Erreur lors du nettoyage de {file}: {str(e)}")
            
            # Analyse la conversation en parties avec info de section
            parts = self.parse_conversation(question)
            
            # Définit les durées de pause (en ms)
            pause_durations = {
                'section': 1500,  # 2.5 secondes entre sections
                'speaker': 500,  # 1 seconde entre intervenants dans la même section
                'sentence': 500   # 0.5 secondes entre phrases
            }
            
            # Génère les parties audio avec pauses appropriées
            audio_parts = []
            current_section = None
            current_speaker = None
            
            for i, (speaker, text, gender, section) in enumerate(parts):
                # Ajoute une pause de section si la section change
                if section != current_section:
                    if current_section is not None:  # Pas la première section
                        audio_parts.append(self.generate_silence(pause_durations['section']))
                    current_section = section
                    current_speaker = None  # Réinitialise l'intervenant actuel lors du changement de section
                
                # Ajoute une pause de changement d'intervenant dans la même section
                elif speaker != current_speaker:
                    audio_parts.append(self.generate_silence(pause_durations['speaker']))
                
                # Met à jour l'intervenant actuel
                current_speaker = speaker
                
                # Génère l'audio pour cette partie
                voice = self.get_voice_for_gender(gender)
                print(f"Utilisation de la voix {voice} pour {speaker} ({gender}) dans la section {section}")
                
                audio_file = self.generate_audio_part(text, voice)
                audio_parts.append(audio_file)
                
                # Add a short pause after each speaker's line (except the last one)
                if i < len(parts) - 1:
                    audio_parts.append(self.generate_silence(pause_durations['sentence']))
            
            # Combine toutes les parties en un seul fichier
            file_list = None
            try:
                # Crée une liste de fichiers pour ffmpeg
                with tempfile.NamedTemporaryFile('w', dir=self.temp_dir, suffix='.txt', delete=False) as f:
                    for audio_file in audio_parts:
                        if os.path.exists(audio_file) and os.path.getsize(audio_file) > 0:
                            f.write(f"file '{os.path.abspath(audio_file)}'\n")
                    file_list = f.name
                
                # Combine les fichiers audio en une seule sortie
                subprocess.run([
                    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
                    '-i', file_list,
                    '-c', 'copy',
                    output_file
                ], check=True)
                
                print(f"Fichier audio généré avec succès: {output_file}")
                return output_file
                
            except Exception as e:
                print(f"Erreur lors de la combinaison des fichiers audio: {str(e)}")
                if os.path.exists(output_file):
                    os.unlink(output_file)
                raise
            finally:
                # Nettoie les fichiers temporaires
                if file_list and os.path.exists(file_list):
                    os.unlink(file_list)
                for audio_file in audio_parts:
                    if os.path.exists(audio_file):
                        try:
                            os.unlink(audio_file)
                        except Exception as e:
                            print(f"Erreur lors du nettoyage de {audio_file}: {str(e)}")
            
        except Exception as e:
            # Nettoie le fichier de sortie s'il existe
            if os.path.exists(output_file):
                os.unlink(output_file)
            raise Exception(f"Échec de la génération audio: {str(e)}")