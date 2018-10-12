<template>
  <div class="card">
    <div class="card-header d-flex">
      <h4>{{ title }}</h4>

      <div v-if="allowEditing" class="ml-auto">
        <button type="button"
                v-if="isViewMode"
                class="btn btn-primary"
                @click="enterEditMode">
          Edit
        </button>
        <div class="btn-group"
             v-if="isEditMode">
          <button type="button"
                  class="btn btn-primary"
                  @click="save">
            Save
          </button>
          <button type="button"
                  class="btn btn-secondary"
                  @click="clear">
            Cancel
          </button>
        </div>
      </div>
      <button type="button"
              v-if="allowDelete"
              class="btn btn-outline-danger"
              :class="allowEditing ? 'ml-2' : 'ml-auto'"
              data-toggle="modal"
              data-target="#areYouSureDelete">
        Delete
      </button>
      <div class="modal" id="areYouSureDelete" tabindex="-1" role="dialog"
           aria-labelledby="areYouSureDeleteTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="areYouSureDeleteTitle">Delete {{ title }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete {{ title }}? This cannot be undone.
            </div>
            <div class="modal-footer">
              <button type="button"
                      class="btn btn-danger"
                      data-dismiss="modal"
                      @click="$emit('delete-obj')">
                Yes, delete {{ title }}
              </button>
              <button type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot name="view" v-if="isViewMode"></slot>
    <slot name="edit" v-if="isEditMode"></slot>
  </div>
</template>

<script>
const VIEW_MODE = 0;
const EDIT_MODE = 1;

export default {
  name: "ObjectDetail",
  props: {
    title: {
      type: String
    },
    startEditing: {
      type: Boolean,
      default: false
    },
    allowEditing: {
      type: Boolean,
      default: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    saveFunc: {
      type: Function,
      default: async () => {}
    },
    clearFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      mode: this.startEditing ? EDIT_MODE : VIEW_MODE
    };
  },
  computed: {
    isViewMode() {
      return this.mode === VIEW_MODE;
    },
    isEditMode() {
      return this.mode === EDIT_MODE;
    }
  },
  methods: {
    enterEditMode() {
      this.mode = EDIT_MODE;
    },
    async save() {
      await this.saveFunc();
      this.exitEditMode();
    },
    clear() {
      this.clearFunc();
      this.exitEditMode();
    },
    exitEditMode() {
      this.mode = VIEW_MODE;
    }
  }
};
</script>
