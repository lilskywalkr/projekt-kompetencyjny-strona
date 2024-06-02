<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['path', 'url']);
const viewer = ref(null);

onMounted(() => {
  if (process.client) {
    import('@pdftron/webviewer').then((WebViewer) => {
      WebViewer.default({
        path: props.path,
        initialDoc: props.url,
        isReadOnly: true,
      }, viewer.value).then(instance => {
        instance.UI.disableDownload();
        instance.UI.disablePrint();
        instance.UI.disableElements([ 'saveAsButton' ]);
      });
    });
  }
});
</script>

<template>
  <div id="webviewer" ref="viewer"></div>
</template>

<style scoped lang="scss">
  #webviewer {
    height: 100vh; /* Ensure the viewer takes full height */
    width: 100%;
  }
</style>
