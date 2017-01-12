const sv_marker_ctrl = {
  template: '#sv_marker_ctrl',
  props: {
    data: Object
  },
  data: function() {
    return {
    }
  },
  methods: {
    dblclick: function(marker) {
      window.frames[0].postMessage({
        ep: "JOVE",
        operation: "openMarker",
        marker: marker
      }, '*');
    }
  },
  computed: {
    material() {
      return this.data
    },
    dict() {
      return this.$store.state.dict
    }
  }
}
