<template>
  <div class="image-container">
    <img
      :class="imgIsLoaded ? 'show' : ''"
      :src="src"
      loading="lazy"
      @load="imgLoadedMethod"
    >
  </div>
</template>

<script>
export default {
  props: {
    src: String
  },
  data () {
    return {
      imgIsLoaded: false
    }
  },
  methods: {
    imgLoadedMethod () {
      this.imgIsLoaded = true
    }
  }
}
</script>

<style scoped>
.image-container {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow: hidden;
}

img {
  position: absolute;
  bottom: 0;
  left: 50%;

  width: auto;
  height: auto;

  max-height: none;
  max-width: none;

  
  min-width: 100%;

  transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
  -webkit-transform: translate(-50%, 0%);

  opacity: 0;
  transition: opacity 3s;
}

img.show {
  opacity: 0.8;
}
</style>