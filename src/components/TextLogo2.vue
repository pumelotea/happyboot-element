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
  background: #ffd700;
  color: black;
  padding: 5px;
  box-sizing: border-box;
  font-size: 26px;
}

.boot {
  background: black;
  color: #ffd700;
  padding: 5px;
  box-sizing: border-box;
  font-size: 20px;
}
</style>
