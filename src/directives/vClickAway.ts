

const vClickAway = {
    updated: (el: HTMLElement, binding: any) => {
        document.addEventListener('click', (event) => {
            if (!(el as any).contains(event.target) && binding.arg) {
                binding.instance!.isOpen = false;
            }
        });
    },
    unmounted: (el: HTMLElement) => {
        document.removeEventListener('click', () => {});
    },

};

export default vClickAway;