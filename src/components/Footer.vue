<!-- @format -->

<template>
  <footer>
    <p>
      © {{new Date().getFullYear()}} MYRUNES [{{ version }}] &nbsp;&nbsp;|&nbsp;&nbsp;
      <a
        href="https://github.com/myrunes/backend/blob/master/docs/imprint.txt"
      >IMPRINT</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <router-link to="/contact">CONTACT</router-link>&nbsp;&nbsp;|&nbsp;&nbsp;
      <router-link to="/about">ABOUT</router-link>
    </p>
  </footer>
</template>

<script>
/** @format */

import Rest from '../js/rest';

export default {
  name: 'Footer',

  props: {},

  methods: {},

  asyncComputed: {
    version() {
      return new Promise((resolve, rejects) => {
        Rest.getVersion().then((data) => {
          resolve(data.body.version);
        });
      });
    },
  },
};
</script>

<style scoped>
/** @format */

p,
a {
  margin: 0px;
  font-size: 12px;
  color: rgb(202, 202, 202) !important;
}

a {
  text-decoration: underline;
}

footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 5px 12px;
  background-color: #37474f;
  text-align: center;
  z-index: 99;
}
</style>
