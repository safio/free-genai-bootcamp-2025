---
library_name: transformers
tags: []
---

# Model Card for Florence-2-FT-ArabicOCR

Florence-2 for ArabicOCR

## Usage 

```python
import requests

from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM 


model = AutoModelForCausalLM.from_pretrained("gagan3012/Florence-2-FT-ArabicOCR", trust_remote_code=True)
processor = AutoProcessor.from_pretrained("gagan3012/Florence-2-FT-ArabicOCR", trust_remote_code=True)

prompt = "<ArabicOCR>"

url = "https://datasets-server.huggingface.co/cached-assets/Fakhraddin/khatt/--/a3236e1dee690fbb4ce9ceadac24b2be375f5503/--/default/validation/0/image/image.jpg?Expires=1719446453&Signature=WaBqdA7YWlwmyVFf~Nr4l0Qm6uM34p9e7Df4GPLNA93qhg7VS3JgZpqHvHWA3ZRqaz7JbPANNSrEv27lskSAGcZ6ow168Lv2Yzkemv87mA6sbED9UqTQAyeSWgCZ6z-3OUHLIfHRtrlsSetKDSyhKSYhIHARx8tI-Z35wOhTXnPDWbq63rtrFQ1YFc~u-YzETwn7SWqXO-NJpl-JZ~xPSbYHzrDQtZgFxnrC~aEyVzJXdfdQ8v7AxzRoz5I6ISimDADy-KGu0d6LuYd3eAwf-LWwGbLEeNYtMZgevRJIFeDxi-75lYitmxiVG0BLfNFtJAJGYvjpeLsug0cIwo-pAg__&Key-Pair-Id=K3EI6M078Z3AC3"
image = Image.open(requests.get(url, stream=True).raw)

if image.mode != "RGB":
    image = image.convert("RGB")

inputs = processor(text=prompt, images=image, return_tensors="pt")

generated_ids = model.generate(
    input_ids=inputs["input_ids"],
    pixel_values=inputs["pixel_values"],
    max_new_tokens=1024,
    do_sample=False,
    num_beams=3
)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

parsed_answer = processor.post_process_generation(generated_text, task="<ArabicOCR>", image_size=(image.width, image.height))

print(parsed_answer)
```

