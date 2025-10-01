import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'wave-video',
  template: `
    <div class="player-wrapper">
      <iframe
        [src]="safeUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `,
  styles: [`
    .player-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%; 
    }
    .player-wrapper iframe {
      position: absolute; inset: 0; width: 100%; height: 100%;
      border-radius: 12px;
    }
  `]
})
export class WaveVideoComponent {
  @Input() embedUrl = ''; 
  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
  }
}
