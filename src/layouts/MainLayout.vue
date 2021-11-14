<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Row Bender
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <q-item-label
          header
        >
          Build With
        </q-item-label>

        <EssentialLink
          v-for="link in madeWithLinksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'

const essentialLinks = [
  {
    title: 'Docs',
    caption: 'Mustache',
    icon: 'school',
    link: 'https://mustache.github.io/mustache.5.html'
  },
  {
    title: 'Sources',
    caption: 'github.com/fred-jacobs/row-bender',
    icon: 'code',
    link: 'https://github.com/fred-jacobs/row-bender'
  },
  {
    title: 'Author',
    caption: 'github.com/fred-jacobs',
    icon: 'favorite',
    link: 'https://github.com/fred-jacobs'
  },
];
const madeWithLinksList = [
  {
    title: 'Mustache',
    caption: 'Templating engine',
    icon: 'library_books',
    link: 'https://mustache.github.io'
  },
  {
    title: 'Quasar',
    caption: 'User interface based on Vue3',
    icon: 'library_books',
    link: 'https://quasar.dev'
  },
  {
    title: 'Monaco Editor',
    caption: 'The code editor that powers VSCode',
    icon: 'library_books',
    link: 'https://microsoft.github.io/monaco-editor/'
  },
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks,
      madeWithLinksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
