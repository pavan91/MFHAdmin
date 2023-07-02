import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePackageComponent } from './create-package/create-package.component';
import { EditPackageComponent } from './edit-package/edit-package.component';
import { PackageListComponent } from './package-list/package-list.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { CreateItineraryComponent } from './create-itinerary/create-itinerary.component';
import { ItineraryListComponent } from './itinerary-list/itinerary-list.component';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { EditItineraryComponent } from './edit-itinerary/edit-itinerary.component';
import { SliderComponent } from "./slider/slider.component";
import { TrendingComponent } from "./trending/trending.component";
import { TrendingItieanaryComponent } from "./trending-itieanary/trending-itieanary.component";
import { TrendingInternationalComponent } from "./trending-international/trending-international.component"
import { ContactsUsComponent } from './contacts-us/contacts-us.component';
import { UpdateItineraryComponent } from './update-itinerary/update-itinerary.component';
import { MostPopularComponent } from './most-popular/most-popular.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: 'sample-form',
        component: SampleFormComponent,
        data: {
          title: 'Sample Form Creation'
        }
      },
      {
        path: 'create-package',
        component: CreatePackageComponent,
        data: {
          title: 'Create Package'
        }
      },
      {
        path: 'edit-package/:CategoryID/:SubCatID',
        component: EditPackageComponent,
        data: {
          title: 'Edit Pkg'
        }
      },
      {
        path: 'list',
        component: PackageListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'create-itinerary',
        component: CreateItineraryComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'list-itineraries',
        component: ItineraryListComponent,
        data: {
          title: 'List Itins'
        }
      },
      {
        path: 'edit-itinerary/:ItineraryID',
        component: EditItineraryComponent,
        data: {
          title: 'Edit Itinerary Details'
        }
      },
      {
        path: 'update-itinerary/:ItineraryID',
        component: UpdateItineraryComponent,
        data: {
          title: 'Edit Itinerary Details'
        }
      },
      {
        path: 'slider',
        component: SliderComponent,
        data: {
          title: 'Slider'
        }
      },
      {
        path: 'trending',
        component: TrendingComponent,
        data: {
          title: 'Trending Domestic Packages'
        }
      },
      {
        path: 'trending-international',
        component: TrendingInternationalComponent,
        data: {
          title: 'Trending International Packages'
        }
      },
      {
        path: 'trending-Itenary',
        component: TrendingItieanaryComponent,
        data: {
          title: 'Trending Itenary'
        }
      },
      {
        path: 'most-popular',
        component: MostPopularComponent,
        data: {
          title: 'Most Popular'
        }
      },
      {
        path: 'contact',
        component: ContactsUsComponent,
        data: {
          title: 'Contact Us'
        }
      },
      
      {
        path: 'create-user',
        component: CreateUserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
