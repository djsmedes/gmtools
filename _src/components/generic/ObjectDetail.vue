<template>
  <v-container>
    <v-card>
      <slot></slot>
      <slot name="view" v-if="isViewMode"></slot>
      <slot name="edit" v-if="isEditMode"></slot>
      <v-card-actions>
        <v-layout justify-end>
        <v-btn
            v-if="saveFunc && isViewMode"
            @click="enterEditMode"
            flat>
          Edit
        </v-btn>
        <v-btn
            v-if="saveFunc && isEditMode"
            @click="save"
            flat>
          Save
        </v-btn>
        <v-btn
            v-if="saveFunc && isEditMode"
            @click="clear"
            flat>
          Cancel
        </v-btn>
        <v-dialog v-if="deleteFunc" v-model="deleteDialog" :width="500">
          <v-btn flat slot="activator">
            Delete
          </v-btn>
          <v-card>
            <v-card-text>
              Are you sure you want to delete {{ name }}? This cannot be undone.
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click="deleteFunc">
                Yes, delete {{ name }}
              </v-btn>
              <v-btn flat @click="deleteDialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
const VIEW_MODE = 0;
const EDIT_MODE = 1;

export default {
  name: "ObjectDetail",
  props: {
    name: {
      type: String
    },
    startEditing: {
      type: Boolean,
      default: false
    },
    saveFunc: {
      type: Function,
      default: null
    },
    clearFunc: {
      type: Function,
      default: () => {}
    },
    deleteFunc: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      mode: this.startEditing && this.saveFunc ? EDIT_MODE : VIEW_MODE,
      deleteDialog: false
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
