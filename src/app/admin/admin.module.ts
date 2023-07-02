import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { PostService } from '../././../services/post.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { CreateItineraryComponent } from './create-itinerary/create-itinerary.component';
import { EditPackageComponent } from './edit-package/edit-package.component';
import { ItineraryListComponent } from './itinerary-list/itinerary-list.component';
import { PackageListComponent } from './package-list/package-list.component';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { APIInterceptor } from '../../interceptors/api-interceptor.service';
import { EditItineraryComponent } from './edit-itinerary/edit-itinerary.component';
import { TrendingComponent } from './trending/trending.component';
import { SliderComponent } from './slider/slider.component';


import { ToastModule } from '@coreui/angular';
import { EditSliderComponent } from './edit-slider/edit-slider.component';
import { TrendingItieanaryComponent } from './trending-itieanary/trending-itieanary.component';
import { TrendingInternationalComponent } from './trending-international/trending-international.component';
import { AddSliderComponent } from './add-slider/add-slider.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AlertModule } from '@coreui/angular';
import { ContactsUsComponent } from './contacts-us/contacts-us.component';
import { UpdateItineraryComponent } from './update-itinerary/update-itinerary.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { NgxTinymceModule } from 'ngx-tinymce';
import { MostPopularComponent } from './most-popular/most-popular.component';


@NgModule({
  declarations: [
    CreateUserComponent,
    CreatePackageComponent,
    CreateItineraryComponent,
    EditPackageComponent,
    ItineraryListComponent,
    PackageListComponent,
    SampleFormComponent,
    EditItineraryComponent,
    TrendingComponent,
    SliderComponent,
    EditSliderComponent,
    TrendingItieanaryComponent,
    TrendingInternationalComponent,
    AddSliderComponent,
    ContactsUsComponent,
    UpdateItineraryComponent,
    MostPopularComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AlertModule,
    IconModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/',
    })
  ],
  providers: [
    PostService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true
    },
    NgxImageCompressService,
    IconSetService 
  ],
})
export class AdminModule { }
