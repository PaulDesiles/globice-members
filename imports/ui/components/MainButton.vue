<template>
  <router-link :to="target">
    <img :src="'/img/' + target + '.jpg'" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  props: {
    target: String,
    label: String
  }
}
</script>

<style>
  a {
    color: white;
    text-decoration: none;
  }

  a img {
    width: 150px;
    border-radius: 50%;
    border: 7px solid var(--blue);
    margin: 3px;
    box-shadow: 0 0 20px var(--blue-alpha50);
    transition: border .5s, box-shadow .5s;
  }

  a:hover img {
    border-color: var(--blue-hover);
    box-shadow: 0 0 20px var(--blue);
  }

  a span {
    display: block;
    text-align: center;
    font-size: 14pt;
  }
</style>