import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../core/language.service";
import {AlertService} from "../core/alert.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private languageService: LanguageService,
    private alertService: AlertService
  ) {
    this.languageService.initDefaultLanguage();
  }

  ngOnInit(): void {
  }

  useLanguage(language: string): void {
    this.languageService.setCurrentLanguage(language);
  }

  alert(): void {
    this.alertService.success("Test");
  }
}
