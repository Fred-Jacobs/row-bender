<template>
  <q-page class="justify-evenly" @dragover.prevent>
    <q-splitter v-model="horizontalSplitterModel" style="width: 100%; max-height:100%; height: calc(100vh - 50px);" horizontal before-class="overflow-hidden" after-class="overflow-hidden" >
      <template v-slot:before>
        <q-splitter v-model="topSplitterModel" style="width: 100%">
          <q-resize-observer @resize="onTemplateEditorResize" />
          <template v-slot:before>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title shrink>Json</q-toolbar-title>
              <q-space />
            </q-toolbar>
            <file-drop :fileDrop="onJsonEditorChange" >
              <MonacoEditor
                :height="topHeight"
                :value="jsonRef"
                :theme="vsTheme"
                language="json"
                :options="jsonEditorOptions"
                @change="onJsonEditorChange"
              ></MonacoEditor>
            </file-drop>
          </template>
          <template v-slot:after>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-space />
              <q-toolbar-title shrink>Template</q-toolbar-title>
            </q-toolbar>
            <file-drop :fileDrop="onTemplateEditorChange" >
              <MonacoEditor
                :height="topHeight"
                :value="templateRef"
                :theme="vsTheme"
                language="handlebars"
                :options="templateEditorOptions"
                @change="onTemplateEditorChange"
              ></MonacoEditor>
            </file-drop>
          </template>
        </q-splitter>
      </template>
      <template v-slot:after>
        <q-resize-observer @resize="onCsvEditorResize" />
        <q-splitter v-model="bottomSplitterModel" style="width: 100%" before-class="overflow-hidden" after-class="overflow-hidden">
          <template v-slot:before>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>Rows (csv)</q-toolbar-title>
              <q-toggle
                v-model="csvDataAutomaticHeader"
                label="Generate Headers"
                title="Generate headers with names c0..cX, disable it if your first line has header names."
                @update:model-value="onCsvHeaderChange"
                checked-icon="check"
                unchecked-icon="clear"
                color="secondary"
              />
            </q-toolbar>
            <file-drop :fileDrop="onCsvEditorChange" >
              <MonacoEditor
                :height="bottomHeight"
                :value="csvDataRef"
                :theme="vsTheme"
                language="none"
                :options="csvEditorOptions"
                @change="onCsvEditorChange"
              ></MonacoEditor>
            </file-drop>
          </template>
          <template v-slot:after>
            <q-toolbar class="bg-primary text-white shadow-2" style="padding-left: 0;">
              <q-btn @click="copyResultToClipboard" icon="content_copy" stretch title="Copy to clipboard" />
              <q-space />
              <q-toolbar-title shrink>Result</q-toolbar-title>
              <q-select v-model="previewLanguage" :options="previewLanguages" label="Language" dense class="on-right" style="min-width: 100px" />
            </q-toolbar>
            <MonacoEditor
              :height="bottomHeight"
              :value="generatedContentRef"
              :theme="vsTheme"
              :language="previewLanguage"
              :options="generatedContentEditorOptions"
              @change="onResultEditorChange"
            ></MonacoEditor>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MonacoEditor from 'components/MonacoEditor.vue';
import FileDrop from 'components/FileDrop.vue'
import { Size } from 'components/models'
import { useQuasar, copyToClipboard, QVueGlobals } from 'quasar'
import { RenderingService } from 'components/rendering-service'
import { model } from 'components/sample'

const heightSplit = 55
const refs = {
  horizontalSplitterModel: ref(heightSplit),
  topSplitterModel: ref(50),
  bottomSplitterModel: ref(50),
  topHeight: ref(`calc(${heightSplit}vh - 50px)`),
  bottomHeight: ref(`calc(${100-heightSplit}vh - 50px)`),
  csvDataAutomaticHeader: ref(model.csvHasHeaders),
  templateRef: ref(model.template || ''),
  jsonRef: ref(model.json || ''),
  csvDataRef: ref(model.csv || ''),
  generatedContentRef: ref(''),
  previewLanguage: ref(model.language),
  previewLanguages: ['none','xml', 'json', 'javascript', 'typescript'],
  templateEditorOptions: ref({
    automaticLayout: true
  }),
  jsonEditorOptions: ref({
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

const rendering = new RenderingService()
let generatedContent = refs.generatedContentRef.value
let $q : QVueGlobals

export default defineComponent({
  name: 'PageIndex',
  components: {
    MonacoEditor, FileDrop
  },
  methods:{
    onTemplateEditorChange: function(msg : string){
      refs.templateRef.value = msg
      refs.generatedContentRef.value = rendering.setTemplate(msg).render()
    },
    onJsonEditorChange: function(msg : string){
      refs.jsonRef.value = msg
      refs.generatedContentRef.value = rendering.setJson(msg).render()
    },
    onCsvEditorChange: function(msg : string){
      refs.csvDataRef.value = msg
      refs.generatedContentRef.value = rendering.setCsv(!refs.csvDataAutomaticHeader.value, msg).render()
    },
    onCsvHeaderChange: function(){
      refs.generatedContentRef.value = rendering.setCsv(!refs.csvDataAutomaticHeader.value, undefined).render()
    },
    onResultEditorChange: function(msg : string){
      generatedContent = msg
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
  computed: {
    vsTheme() {
      return $q.dark.isActive ? 'vs-dark' : 'vs'
    }
  },
  mounted() {
    refs.generatedContentRef.value = rendering.render()
  },
  setup() {
    $q = useQuasar()
    rendering.onError = (msg: string) => {
      $q.notify({ color: 'negative', message: msg, icon: 'report_problem', position: 'top' })
    }
    rendering.setTemplate(refs.templateRef.value)
    rendering.setJson(refs.jsonRef.value)
    rendering.setCsv(!refs.csvDataAutomaticHeader.value, refs.csvDataRef.value)

    return {
      ...refs
    };
  }
});
</script>
