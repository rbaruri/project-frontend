import { ModalClasses } from '../types';

export const getModalClasses = (): ModalClasses => ({
  modalOverlay: 'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
  modalPanel: 'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6',
  iconContainer: 'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100',
  button: 'mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:mt-0 sm:w-auto'
}); 