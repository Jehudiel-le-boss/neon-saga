import { inject, type InjectionKey } from "vue";

export type SiteUiSound = (frequency?: number) => void;

export const siteUiSoundKey: InjectionKey<SiteUiSound> = Symbol("neon-saga-ui-sound");

export function useSiteSound(): SiteUiSound {
  return inject(siteUiSoundKey, () => undefined);
}
