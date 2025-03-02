import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-language-modal',
  imports: [
    NgForOf,
    TranslatePipe
  ],
  templateUrl: './language-modal.component.html',
  styleUrl: './language-modal.component.css'
})
export class LanguageModalComponent {
  @Input() selectedLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  languages = [
    {code: 'en', label: 'English', region: 'International'},
    {code: 'et', label: 'Eesti keel', region: 'Eesti'},
    {code: 'ru', label: 'Русский', region: 'Eesti'}
  ];

  selectLanguage(language: string) {
    this.languageChange.emit(language);
    this.closeModal.emit();
  }
}
