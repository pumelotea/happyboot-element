<template>
  <div class="logo-container">
    <span class="happy">HAPPY</span>
    <span class="boot">BOOT</span>
  </div>
</template>

<script>
export default {
  name: 'TextLogo'
}
</script>

<style scoped>

.logo-container{
  display: flex;
  align-items: center;
}
.happy {
  background: #71d2aa;
  color: white;
  padding: 5px;
  box-sizing: border-box;
  font-size: 26px;
}

.boot {
  background: white;
  color: #71d2aa;
  padding: 5px;
  box-sizing: border-box;
  font-size: 20px;
}
</style>
