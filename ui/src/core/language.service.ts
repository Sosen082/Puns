import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLanguage: string;

  constructor(
    private translateService: TranslateService,
    private titleService: Title
  ) {
  }

  initDefaultLanguage(): void {
    const storageLang = localStorage.getItem('language');
    const lang = (storageLang) ? storageLang : environment.defaultLanguage;

    this.translateService.setDefaultLang(lang);
    this.setCurrentLanguage(lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setCurrentLanguage(language: string): void {
    this.currentLanguage = language;
    this.translateService.use(language);
    localStorage.setItem('language', language);

    this.setTitle();
  }

  private setTitle(): void {
    this.translateService.get("title").subscribe(translated => this.titleService.setTitle(translated));
  }
}
