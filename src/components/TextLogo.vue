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
  background: #71d2aa;
  color: white;
  padding: 6px;
  font-weight: bold;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  border:1px solid #71d2aa;
}

.boot {
  background: white;
  border:1px solid #71d2aa;
  color: #71d2aa;
  padding: 6px;
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  border-left: none;
}
</style>
