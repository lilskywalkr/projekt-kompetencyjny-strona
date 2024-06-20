<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['path', 'url']);
const viewer = ref(null);
const useUser = useUserStore();

onMounted(() => {
  if (process.client) {
    import('@pdftron/webviewer').then((WebViewer) => {
      WebViewer.default({
        path: props.path,
        initialDoc: props.url,
        isReadOnly: true,
        fullAPI: true,
      }, viewer.value).then(instance => {
        instance.UI.disableDownload();
        instance.UI.disablePrint();
        instance.UI.disableElements([ 'saveAsButton', 'selectToolButton' ]);
        instance.Core.Tools.Tool.disableTextSelection();

        const { documentViewer } = instance.Core;

        documentViewer.setWatermark({
          // Draw diagonal watermark in middle of the document
          diagonal: {
            fontSize: 30, // or even smaller size
            fontFamily: 'sans-serif',
            color: 'red',
            opacity: 50, // from 0 to 100
            text: useUser.getUserEmail(),
          },
        });
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
