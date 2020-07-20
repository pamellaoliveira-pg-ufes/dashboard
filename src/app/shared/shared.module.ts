import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CardComponent } from './components/card/card.component';
import { CardHeaderComponent } from './components/card/sub-components/card-header/card-header.component';
import { CardContentComponent } from './components/card/sub-components/card-content/card-content.component';
import { CardFooterComponent } from './components/card/sub-components/card-footer/card-footer.component';


@NgModule({
  declarations: [
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  exports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule,

    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent
  ]
})
export class SharedModule { }
