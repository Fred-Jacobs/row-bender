<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { h } from 'vue'

function noop() { }

export { monaco };

export default {
  name: 'MonacoEditor',
  props: {
    diffEditor: { type: Boolean, default: false },
    width: {type: [String, Number], default: '100%'},
    height: {type: [String, Number], default: '100%'},
    original: String,
    value: String,
    language: {type: String, default: 'javascript'},
    theme: {type: String, default: 'vs'},
    options: {type: Object, default() {return {};}},
    editorMounted: {type: Function, default: noop},
    editorBeforeMount: {type: Function, default: noop}
  },

  watch: {
    options: {
      deep: true,
      handler(options) {
        this.editor && this.editor.updateOptions(options);
      }
    },

    value() {
      if (!this.editor) return;
      if (typeof this.value !== 'string') return;
      let val = this._getValue()
      if (this.value !== val)
      {
        this._setValue(this.value)
      }
    },

    language() {
      if(!this.editor) return;
      if(this.diffEditor){
        const { original, modified } = this.editor.getModel();
        monaco.editor.setModelLanguage(original, this.language);
        monaco.editor.setModelLanguage(modified, this.language);
      }else
        monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    },

    theme() {
      this.editor && monaco.editor.setTheme(this.theme);
    },

    style() {
      this.editor && this.$nextTick(() => {
        this.editor.layout();
      });
    }
  },

  computed: {
    style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
        height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`,
        'max-width': '100%',
        'max-height': '100%',
        overflow: 'hidden'
      }
    }
  },

  render () {
    return h('div', {
      class: 'monaco_editor_container',
      style: {
        width: this.width,
        height: this.height,
        'max-width': '100%',
        'max-height': '100%',
        overflow: 'hidden'
      }
    })

  },

  mounted () {
    this.initMonaco();
  },

  beforeUnmount() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco() {
      const { value, language, theme, options } = this;
      Object.assign(options, this._editorBeforeMount());
      const factory = this.diffEditor ? monaco.editor.createDiffEditor : monaco.editor.create
      this.editor = factory(this.$el, {
        value: value,
        language: language,
        theme: theme,
        ...options
      });
      this.diffEditor && this._setModel(this.value, this.original);
      this._editorMounted(this.editor);
    },

    _getEditor() {
      if(!this.editor) return null;
      return this.diffEditor ? this.editor.modifiedEditor : this.editor;
    },

    _setModel(value, original) {
      const { language } = this;
      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(value, language);
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },

    _setValue(value) {
      let editor = this._getEditor();
      if(editor) return editor.setValue(value);
    },

    _getValue() {
      let editor = this._getEditor();
      if(!editor) return '';
      return editor.getValue();
    },

    _editorBeforeMount() {
      const options = this.editorBeforeMount(monaco);
      return options || {};
    },

    _editorMounted(editor) {
      this.editorMounted(editor, monaco);
      if(this.diffEditor){
        editor.onDidUpdateDiff((event) => {
          const value = this._getValue();
          this._emitChange(value, event);
        });
      }else{
        editor.onDidChangeModelContent(event => {
          const value = this._getValue();
          this._emitChange(value, event);
        });
      }
    },

    _emitChange(value, event) {
      this.$emit('change', value, event);
      this.$emit('input', value);
    }
  }
}
</script>
