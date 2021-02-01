<template>
  <div>
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
.happy {
  background: #ffd700;
  color: black;
  padding: 6px;
  font-weight: bold;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.boot {
  background: black;
  color: #ffd700;
  padding: 6px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
