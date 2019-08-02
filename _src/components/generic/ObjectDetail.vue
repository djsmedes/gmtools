<template>
  <v-card :class="{ 'display-only': isViewMode }">
    <slot :isViewMode="isViewMode"></slot>
    <slot v-if="isViewMode" name="view"></slot>
    <slot v-if="isEditMode" name="edit"></slot>
    <v-card-actions>
      <v-btn
        v-if="(saveFunc || deleteFunc) && isViewMode"
        text
        @click="enterEditMode"
      >
        Edit
      </v-btn>
      <v-btn v-if="saveFunc && isEditMode" text @click="save">
        Save
      </v-btn>
      <v-btn v-if="saveFunc && isEditMode" text @click="clear">
        Cancel
      </v-btn>
      <v-dialog
        v-if="deleteFunc && isEditMode"
        v-model="deleteDialog"
        :width="500"
      >
        <v-btn slot="activator" text>
          Delete
        </v-btn>
        <v-card>
          <v-card-text>
            Are you sure you want to delete {{ name }}? This cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="deleteSelf"> Yes, delete {{ name }} </v-btn>
            <v-btn text @click="deleteDialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
const VIEW_MODE = 0;
const EDIT_MODE = 1;

export default {
  name: "ObjectDetail",
  props: {
    name: {
      type: String,
      required: true,
    },
    startEditing: {
      type: Boolean,
      default: false,
    },
    saveFunc: {
      type: Function,
      default: null,
    },
    clearFunc: {
      type: Function,
      default: () => {},
    },
    deleteFunc: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      mode: VIEW_MODE,
      deleteDialog: false,
    };
  },
  computed: {
    isViewMode() {
      return this.mode === VIEW_MODE;
    },
    isEditMode() {
      return this.mode === EDIT_MODE;
    },
  },
  watch: {
    startEditing: {
      handler(newVal) {
        if (newVal && this.saveFunc) {
          this.mode = EDIT_MODE;
        } else {
          this.mode = VIEW_MODE;
        }
      },
      immediate: true,
    },
  },
  methods: {
    enterEditMode() {
      this.mode = EDIT_MODE;
      this.$emit("enter-edit-mode");
    },
    async save() {
      await this.saveFunc();
      this.exitEditMode();
    },
    clear() {
      this.clearFunc();
      this.exitEditMode();
    },
    deleteSelf() {
      this.deleteDialog = false;
      this.deleteFunc();
    },
    exitEditMode() {
      this.mode = VIEW_MODE;
      this.$emit("enter-view-mode");
    },
  },
};
</script>
