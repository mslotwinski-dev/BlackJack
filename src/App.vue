<template>
  <nav>
    <img src="@/assets/logo.png" />
    Zeus Cassino
  </nav>
  <router-view />
</template>

<style lang="scss">
nav {
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  color: #fff;
  background-color: #3f7f7f;
  border-radius: 10px;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 5px;
}
</style>
