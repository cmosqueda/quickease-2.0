import StarterKit from "@tiptap/starter-kit";

const _TIPTAP_EXTENSIONS = [
    StarterKit.configure({
        heading: {
            levels: [1],
            HTMLAttributes: {
                class: "text-4xl",
            },
        },
        bulletList: {
            HTMLAttributes: {
                class: "list-disc pl-8 list-outside",
            }
        },
        orderedList: {
            HTMLAttributes: {
                class: "list-decimal pl-8 list-outside",
            },
        },
        codeBlock: {
            HTMLAttributes: {
                class: "bg-base-200",
            },
        },
        horizontalRule: {
            HTMLAttributes: {
                class: "border-t border-base-content/25",
            },
        },
        blockquote: {
            HTMLAttributes: {
                class: "p-4 my-4 border-s-4 bg-base-200 w-fit"
            }
        }
    })
]

export default _TIPTAP_EXTENSIONS