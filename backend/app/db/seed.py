from sqlalchemy.orm import Session
from app.models.models import Word, Group, StudyActivity, words_groups

def seed_data(db: Session):
    # Create study activities
    activities = [
        StudyActivity(
            name="Flashcards",
            description="Practice vocabulary with flashcards",
            thumbnail_url="/images/flashcards.png"
        ),
        StudyActivity(
            name="Multiple Choice",
            description="Test your knowledge with multiple choice questions",
            thumbnail_url="/images/multiple-choice.png"
        ),
        StudyActivity(
            name="Writing Practice",
            description="Practice writing French words and phrases",
            thumbnail_url="/images/writing.png"
        )
    ]
    
    for activity in activities:
        db.add(activity)
    
    # Create groups
    groups = [
        Group(name="Basics"),
        Group(name="Greetings"),
        Group(name="Numbers"),
        Group(name="Colors"),
        Group(name="Food & Drinks"),
        Group(name="Family"),
        Group(name="Time"),
        Group(name="Weather")
    ]
    
    for group in groups:
        db.add(group)
    
    db.commit()
    
    # Create words with their translations
    word_data = {
        "Basics": [
            ("oui", "yes"),
            ("non", "no"),
            ("s'il vous plaît", "please"),
            ("merci", "thank you"),
            ("de rien", "you're welcome")
        ],
        "Greetings": [
            ("bonjour", "hello"),
            ("au revoir", "goodbye"),
            ("bonsoir", "good evening"),
            ("salut", "hi"),
            ("à bientôt", "see you soon")
        ],
        "Numbers": [
            ("un", "one"),
            ("deux", "two"),
            ("trois", "three"),
            ("quatre", "four"),
            ("cinq", "five")
        ],
        "Colors": [
            ("rouge", "red"),
            ("bleu", "blue"),
            ("vert", "green"),
            ("jaune", "yellow"),
            ("noir", "black")
        ],
        "Food & Drinks": [
            ("pain", "bread"),
            ("lait", "milk"),
            ("eau", "water"),
            ("vin", "wine"),
            ("fromage", "cheese")
        ],
        "Family": [
            ("mère", "mother"),
            ("père", "father"),
            ("soeur", "sister"),
            ("frère", "brother"),
            ("grand-mère", "grandmother")
        ],
        "Time": [
            ("heure", "hour"),
            ("minute", "minute"),
            ("jour", "day"),
            ("semaine", "week"),
            ("mois", "month")
        ],
        "Weather": [
            ("soleil", "sun"),
            ("pluie", "rain"),
            ("vent", "wind"),
            ("neige", "snow"),
            ("nuage", "cloud")
        ]
    }
    
    # Add words to database and associate them with groups
    for group_name, words in word_data.items():
        group = db.query(Group).filter(Group.name == group_name).first()
        
        for french, english in words:
            word = Word(french=french, english=english)
            db.add(word)
            db.flush()  # Get the word ID
            
            # Create association between word and group using the association table
            stmt = words_groups.insert().values(word_id=word.id, group_id=group.id)
            db.execute(stmt)
    
    db.commit() 