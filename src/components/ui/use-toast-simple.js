// Version vide de useToast pour déboguer
export const toast = ({ ...props }) => {
  console.log('Toast called:', props);
};

export function useToast() {
  return {
    toast: () => console.log('useToast called'),
    toasts: [],
  };
}
