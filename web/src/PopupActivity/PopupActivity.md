```js
const activities = [
    {
      "activityType": "multipleChoice",
      "model": {
        "question": "Andrea's prices may need to ____ when another restaurant comes to town with cheap prices.",
        "answer": 1,
        "choices": ["go down", "stay the same", "go up"]
      }
    },
    {
      "activityType": "multipleChoice",
      "model": {
        "question": "You can calculate ____ by multiplying your price by 0.10, and adding that to your original price.",
        "answer": 1,
        "choices": ["a discount", "sales tax", "your tip"]
      }
    },
    {
      "activityType": "multipleChoice",
      "model": {
        "question": "Andrea wants us to build software so he can ____.",
        "answer": 1,
        "choices": ["sell his food in his store", "calculate tips", "sell his food online"]
      }
    },
  ];
<PopupActivity activities={activities} />
```