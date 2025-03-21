import { Module } from '../types';

export const navigateToModule = (moduleId: string): string => {
  return `/module-detail/${moduleId}`;
};

export const getModuleRoute = (module: Module): string => {
  return navigateToModule(module.id);
}; 