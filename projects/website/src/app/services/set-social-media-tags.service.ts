import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SetSocialMediaTagsService {
  private urlMeta = 'og:url';
  private titleMeta = 'og:title';
  private descriptionMeta = 'og:description';
  private imageMeta = 'og:image';
  private secureImageMeta = 'og:image:secure_url';

  constructor(private metaService: Meta) { }

  public setFacebookTags(url: string, title: string, description: string, imageUrl: string): void {
    const tags = [
      new MetaTag(this.urlMeta, url),
      new MetaTag(this.titleMeta, title),
      new MetaTag(this.descriptionMeta, description),
      new MetaTag(this.imageMeta, imageUrl),
      new MetaTag(this.secureImageMeta, imageUrl)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }
}
export class MetaTag {
  name: string;
  value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
