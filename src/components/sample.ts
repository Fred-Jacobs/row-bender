import { BenderModel } from './models'

const model = new BenderModel()
model.template = `<ul class="{{key}}">
{{#array}}
  <li>{{k1}} : {{k2}}</li>
{{/array}}
{{#rows}}
  <li>{{l0}}:{{l1}} : {{a}}{{c0}} : {{b}}{{c1}} : {{c}}{{c2}}</li>
{{/rows}}
</ul>`
model.json = `{
  "key": "value",
  "array": [
    { "k1": "abc", "k2": "def" },
    { "k1": "ghi", "k2": "jkl" }
  ]
}
`
model.csv = `a;b;c
1;2;3
4;5;6
`
model.csvHasHeaders = true
model.language = 'xml'

export {
  model
}
