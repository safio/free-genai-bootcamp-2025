<test-cases>
    <case id="simple-1">
        <english>I eat bread.</english>
        <vocabulary>
            <word>
                <french>manger</french>
                <english>eat</english>
            </word>
            <word>
                <french>pain</french>
                <english>bread</english>
            </word>
        </vocabulary>
        <structure>[Subject] [Object] [Verb].</structure>
        <considerations>
            - Basic sentence with subject, object, and verb
            - Present tense form
            - Subject can be omitted in French
        </considerations>
    </case>
    <case id="simple-2">
        <english>The book is red.</english>
        <vocabulary>
            <word>
                <french>livre</french>
                <english>book</english>
            </word>
            <word>
                <french>rouge</french>
                <english>red</english>
            </word>
        </vocabulary>
        <structure>[Subject] [Adjective].</structure>
        <considerations>
            - Simple descriptor sentence
            - Uses i-adjective
            - No verb needed in French
        </considerations>
    </case>
</test-cases>

### 1.2 Compound Sentences
```xml
<test-cases>
    <case id="compound-1">
        <english>I eat bread and drink water.</english>
        <vocabulary>
            <word>
                <french>manger</french>
                <english>eat</english>
            </word>
            <word>
                <french>pain</french>
                <english>bread</english>
            </word>
            <word>
                <french>boire</french>
                <english>drink</english>
            </word>
            <word>
                <french>eau</french>
                <english>water</english>
            </word>
        </vocabulary>
        <structure>[Subject] [Object1] [Verb1], [Object2] [Verb2].</structure>
        <considerations>
            - Compound sentence with two actions
            - Subject shared between clauses
            - Uses て form for connection
        </considerations>
    </case>
</test-cases>

### 1.3 Complex Sentences
```xml
<test-cases>
    <case id="complex-1">
        <english>Because it's hot, I drink water.</english>
        <vocabulary>
            <word>
                <french>chaud</french>
                <english>hot</english>
            </word>
            <word>
                <french>boire</french>
                <english>drink</english>
            </word>
            <word>
                <french>eau</french>
                <english>water</english>
            </word>
        </vocabulary>
        <structure>[Reason] [Subject] [Object] [Verb].</structure>
        <considerations>
            - Cause and effect relationship
            - Uses から for "because"
            - Weather description
        </considerations>
    </case>
</test-cases>

## 2. Vocabulary Edge Cases

### 2.1 Multiple Meanings
```xml
<vocabulary-test>
    <word>
        <french>prendre</french>
        <english>take</english>
        <meanings>
            <meaning>to take (time)</meaning>
            <meaning>to cost (money)</meaning>
            <meaning>to hang (on something)</meaning>
        </meanings>
        <test-sentences>
            <sentence>How long does it take?</sentence>
            <sentence>How much does it cost?</sentence>
            <sentence>The picture hangs on the wall.</sentence>
        </test-sentences>
    </word>
</vocabulary-test>

### 2.2 Transitive/Intransitive Pairs
```xml
<vocabulary-test>
    <pair>
        <transitive>
            <french>ouvrir</french>
            <english>to open (something)</english>
        </transitive>
        <intransitive>
            <french>ouvrir</french>
            <english>to open (by itself)</english>
        </intransitive>
        <test-sentences>
            <sentence>I open the door.</sentence>
            <sentence>The door opens.</sentence>
        </test-sentences>
    </pair>
</vocabulary-test>

## 3. State Transition Tests

### 3.1 Valid Transitions
```xml
<transition-test>
    <scenario id="setup-to-attempt">
        <initial-state>Setup</initial-state>
        <input>Je mange du pain.</input>
        <expected-state>Attempt</expected-state>
        <validation>
            - Input contains French text
            - No question marks
            - Contains vocabulary from setup
        </validation>
    </scenario>
    <scenario id="attempt-to-clues">
        <initial-state>Attempt</initial-state>
        <input>Comment utiliser les particules?</input>
        <expected-state>Clues</expected-state>
        <validation>
            - Input is a question
            - References grammar concept
            - Related to previous attempt
        </validation>
    </scenario>
</transition-test>

### 3.2 Invalid Transitions
```xml
<transition-test>
    <scenario id="invalid-clues-to-setup">
        <initial-state>Clues</initial-state>
        <input>Puis-je avoir la réponse?</input>
        <expected-response>
            - Reminder that answers aren't provided
            - Offer additional clues
            - Encourage attempt
        </expected-response>
    </scenario>
</transition-test>

## 4. Teaching Scenario Tests

### 4.1 Common Mistakes
```xml
<teaching-test>
    <scenario id="particle-mistake">
        <student-attempt>Je vais à l'école.</student-attempt>
        <error>Incorrect use of が particle for regular actions</error>
        <expected-guidance>
            - Acknowledge attempt
            - Explain は vs が without giving answer
            - Encourage new attempt
        </expected-guidance>
    </scenario>
    <scenario id="conjugation-mistake">
        <student-attempt>Je mange du pain.</student-attempt>
        <error>Incorrect る verb conjugation</error>
        <expected-guidance>
            - Point out verb type (る verb)
            - Review past tense formation rules
            - Encourage correction
        </expected-guidance>
    </scenario>
</teaching-test>

## 5. Validation Criteria

### 5.1 Response Scoring
```xml
<scoring-criteria>
    <category name="vocabulary-table">
        <criteria>
            - Contains all necessary words (2 points)
            - Correct formatting (2 points)
            - Dictionary forms only (2 points)
            - No particle inclusion (2 points)
            - Appropriate difficulty level (2 points)
        </criteria>
    </category>
    <category name="sentence-structure">
        <criteria>
            - Clear bracketed format (2 points)
            - No conjugations shown (2 points)
            - Appropriate for level (2 points)
            - Matches example patterns (2 points)
            - No particles included (2 points)
        </criteria>
    </category>
</scoring-criteria>

## 6. Documentation Improvements

### 6.1 Version Control
```xml
<version-control>
    <version number="1.0">
        <changes>
            - Initial test documentation
            - Basic test cases added
            - State transition examples
        </changes>
        <date>2025-01-03</date>
    </version>
    <planned-improvements>
        - Add more complex sentence patterns
        - Expand vocabulary edge cases
        - Include cultural context tests
        - Add error recovery scenarios
    </planned-improvements>
</version-control>

### 6.2 Cross-References
```xml
<cross-references>
    <reference id="particles">
        <related-sections>
            - Vocabulary Table Guidelines
            - Common Mistakes
            - Teaching Scenarios
        </related-sections>
        <purpose>Ensure consistent particle handling across documentation</purpose>
    </reference>
    <reference id="verb-conjugation">
        <related-sections>
            - Sentence Structure Guidelines
            - Teaching Scenarios
            - Validation Criteria
        </related-sections>
        <purpose>Maintain consistent verb form handling</purpose>
    </reference>
</cross-references>