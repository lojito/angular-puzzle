import { Component } from '@angular/core';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css'],
})
export class RepositoryComponent {
  readonly imagesPerCategory = 20;
  paths = [];
  folder = '';

  setProperties() {
    const paths = [];

    for (let i = 0; i < this.imagesPerCategory; i++) {
      paths.push(`assets/images/${this.folder}/${i}.jpg?alt=media`);
    }

    this.paths = paths;
  }

  newCategory({ folder }) {
    this.folder = folder;
    this.setProperties();
  }
}
