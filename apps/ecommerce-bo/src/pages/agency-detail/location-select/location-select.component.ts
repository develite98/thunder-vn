import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';

interface Ward {
  name: string;
}

interface Province {
  province: string;
  name: string;
  wards: Ward[];
}

@Component({
  selector: 'ecom-location-select',
  templateUrl: './location-select.component.html',
  imports: [
    NgIf,
    FormsModule,
    NgFor,
    MixDialogWrapperComponent,
    MixButtonComponent,
    TranslocoPipe,
  ],
})
export class LocationSelectorComponent implements OnInit {
  public ref = injectDialogRef();
  provinces: Province[] = [];
  wards: Ward[] = [];

  selectedProvinceCode?: string;
  selectedWardCode?: string;

  valueChange = output<{
    province: Province;
    ward?: Ward;
  }>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<{ data: Province[] }>('/static-data/vn-province-new.json')
      .subscribe((data) => {
        this.provinces = data.data;
      });
  }

  onProvinceChange(): void {
    const selectedProvince = this.provinces.find(
      (p) => p.province == this.selectedProvinceCode,
    );

    this.wards = selectedProvince?.wards || [];
    this.selectedWardCode = undefined;
  }

  onSubmit(): void {
    const selectedProvince = this.provinces.find(
      (p) => p.province == this.selectedProvinceCode,
    );

    if (!selectedProvince) return;

    const selectedWard = this.wards.find(
      (w) => w.name == this.selectedWardCode,
    );

    selectedProvince.name = selectedProvince.name || selectedProvince.province;

    this.ref.close({
      province: selectedProvince,
      ward: selectedWard,
    });
  }
}
