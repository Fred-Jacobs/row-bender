<template>
  <q-page class="justify-evenly">
    <q-splitter
      v-model="horizontalSplitterModel"
      style="width: 100%; max-height:100%; height: calc(100vh - 50px); "
      horizontal

    >
      <template v-slot:before>
        <q-splitter
          v-model="topSplitterModel"
          style="width: 100%"
        >
          <q-resize-observer @resize="onTemplateEditorResize" />
          <template v-slot:before>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>
                Template
              </q-toolbar-title>
            </q-toolbar>
            <MonacoEditor
              :height="topHeight"
              :value="templateRef"
              width="100%"
              :theme="theme"
              language="handlebars"
              :options="templateEditorOptions"
              @change="onTemplateEditorChange"
            ></MonacoEditor>
          </template>
          <template v-slot:after>
            <q-toolbar class="bg-primary text-white shadow-2" style="padding-left: 0;">
              <q-btn
                color="primary"
                @click="copyResultToClipboard"
                icon="content_copy"
                stretch
                title="Copy to clipboard"
              />
              <q-space />
              <q-toolbar-title shrink>
                Result
              </q-toolbar-title>
            </q-toolbar>
            <MonacoEditor
              :height="topHeight"
              :value="generatedContentRef"
              width="100%"
              :theme="theme"
              language="none"
              :options="generatedContentEditorOptions"
              @change="onResultEditorChange"
            ></MonacoEditor>
          </template>
        </q-splitter>
      </template>
      <template v-slot:after>
        <q-resize-observer @resize="onCsvEditorResize" />
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>
            Rows (csv)
          </q-toolbar-title>
          <q-toggle
            v-model="csvDataAutomaticHeader"
            label="Generate Headers"
            title="Generate headers with names c0..cX, disable it if your first line has header names."
            @update:model-value="render"
            checked-icon="check"
            unchecked-icon="clear"
            color="secondary"
          />
        </q-toolbar>
        <MonacoEditor
          :height="bottomHeight"
          :value="csvDataRef"
          width="100%"
          :theme="theme"
          language="none"
          :options="csvEditorOptions"
          @change="onCsvEditorChange"
        ></MonacoEditor>
      </template>

    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MonacoEditor from 'components/MonacoEditor.vue';
import { Size } from 'components/models'
import { copyToClipboard } from 'quasar'
import { RenderingService } from 'components/rendering-service'

const renderingService = new RenderingService()

const refs = {
  theme: ref('vs-dark'),
  horizontalSplitterModel: ref(65),
  topSplitterModel: ref(50),
  topHeight: ref('calc(65vh - 50px)'),
  bottomHeight: ref('calc(35vh - 50px)'),
  csvDataAutomaticHeader: ref(false),
  templateRef: ref('<ul>\r\n{{#rows}}\r\n  <li>{{a}}{{c0}} : {{b}}{{c1}} : {{c}}{{c2}}</li>\r\n{{/rows}}\r\n</ul>'),
  csvDataRef: ref('a;b;c\r\n1;2;3\r\n4;5;6\r\n'),
  generatedContentRef: ref(''),
  templateEditorOptions: ref({
    automaticLayout: true
  }),
  csvEditorOptions: ref({
    automaticLayout: true
  }),
  generatedContentEditorOptions: ref({
    automaticLayout: true,
    readOnly: true
  }),
}

let template = refs.templateRef.value
let generatedContent = refs.generatedContentRef.value
let csvData = refs.csvDataRef.value

export default defineComponent({
  name: 'PageIndex',
  components: {
    MonacoEditor
  },
  methods:{
    render: function() {
      const result = renderingService.generate(template, csvData, !refs.csvDataAutomaticHeader.value)
      refs.generatedContentRef.value = result.value
      if (result.error !== '') {
        refs.generatedContentRef.value = result.error
      }
    },
    onTemplateEditorChange: function(msg : string){
      if (typeof msg !== 'string')
        return

      template = msg
      this.render()
    },
    onResultEditorChange: function(msg : string){
      generatedContent = msg
    },
    onCsvEditorChange: function(msg : string){
      if (typeof msg !== 'string')
        return

      csvData = msg
      this.render()
    },
    copyResultToClipboard: function(){
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      copyToClipboard(generatedContent).then(() => {}).catch(() => {})
    },
    onTemplateEditorResize: function(size : Size) {
      refs.topHeight.value = `${size.height - 50}px`
    },
    onCsvEditorResize: function(size : Size) {
      refs.bottomHeight.value = `${size.height - 50}px`
    }
  },
  mounted() {
    this.render()
  },
  setup() {
    return {
      ...refs
    };
  }
});
</script>
