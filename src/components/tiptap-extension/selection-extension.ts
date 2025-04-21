import { Extension, isNodeSelection } from "@tiptap/react"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"

export const Selection = Extension.create({
  name: "selection",

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: new PluginKey("selection"),
        props: {
          // Adding higher specificity to native browser selection styling
          attributes: {
            class: "selection-enabled",
          },
          decorations(state) {
            if (state.selection.empty) {
              return null
            }

            // Apply selection styling even when editor is focused
            if (!editor.isEditable) {
              return null
            }

            if (isNodeSelection(state.selection)) {
              return null
            }

            return DecorationSet.create(state.doc, [
              Decoration.inline(state.selection.from, state.selection.to, {
                class: "selection",
              }),
            ])
          },
        },
      }),
    ]
  },
})

export default Selection
