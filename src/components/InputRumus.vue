<template>
  <div>
    <div class="card rumus-wrapper">
      <div class="card-content">
        <div class="rumus-display has-background-grey-lighter">
          <small>Rumus</small>
          <p class="is-size-3 has-text-right has-text-weight-bold">
            <span class="has-text-grey-lighter">~</span>
            <span v-if="rumus.length > 0">
              <span v-for="item in rumus" :key="item">{{ item }}</span>
            </span>
          </p>
        </div>
        <br>

        <div class="row">
          <div class="columns">
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus = []" expanded>AC</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('(')" expanded>(</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(')')" expanded>)</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('/')" expanded>÷</b-button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="columns">
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(1)" expanded>1</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(2)" expanded>2</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(3)" expanded>3</b-button>
            </div>

            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('*')" expanded>×</b-button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="columns">
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(4)" expanded>4</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(5)" expanded>5</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(6)" expanded>6</b-button>
            </div>

            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('-')" expanded>-</b-button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="columns">
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(7)" expanded>7</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(8)" expanded>8</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(9)" expanded>9</b-button>
            </div>

            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('+')" expanded>+</b-button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="columns">
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('.')" expanded>.</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push(0)" expanded>0</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.splice(-1)" expanded>←</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="save()" expanded>OK</b-button>
            </div>

          </div>
        </div>

        <div class="row">
          <div class="columns">

            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('L')" expanded>L</b-button>
            </div>
            <div class="column">
              <b-button size="is-large" type="is-dark" @click="rumus.push('T')" expanded>T</b-button>
            </div>
            <div class="column" v-if="fixGlassTop">
              <b-button size="is-large" type="is-dark" @click="rumus.push('A')" expanded>A</b-button>
            </div>
            <div class="column" v-if="fixGlassBottom">
              <b-button size="is-large" type="is-dark" @click="rumus.push('B')" expanded>B</b-button>
            </div>
          </div>
        </div>
        <div class="hint">
          <p class="is-italic"><span>(L) Lebar, (T) Tinggi</span> </p>
          <span v-if="fixGlassTop" class="is-italic">(A) Kaca mati atas</span><span v-if="fixGlassBottom"
            class="is-italic">
            <span v-if="fixGlassTop">, </span>
            (B) Kaca mati bawah
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['idx', 'fixGlassBottom', 'fixGlassTop'],
  data() {
    return {
      rumus: []
    }
  },
  methods: {
    save() {
      this.$emit('rumus', this.rumus.join(''))
    }
  }
}
</script>
<style>
.rumus-wrapper {
  width: 400px;
}

.rumus-display {
  padding: 8px;
  padding-top: 2px;
}

.hint {
  font-size: 9pt;
  padding-top: 16px;
}</style>