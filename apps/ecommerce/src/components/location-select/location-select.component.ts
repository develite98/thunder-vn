import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Ward {
  name: string;
}

export interface Province {
  province: string;
  name: string;
  wards: Ward[];
}

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.component.html',
  imports: [NgIf, FormsModule, NgFor],
})
export class LocationSelectorComponent implements OnInit {
  provinces: Province[] = [];
  wards: Ward[] = [];

  selectedProvinceCode?: string;
  selectedWardCode?: string;

  valueChange = output<{
    province: Province;
    ward?: Ward;
  }>();

  singleValueChange = output<{
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

    this.singleValueChange.emit({
      province: selectedProvince!,
    });
  }

  onWardChange(): void {
    setTimeout(() => {
      this.onSubmit();
    }, 100);
  }

  onSubmit(): void {
    const selectedProvince = this.provinces.find(
      (p) => p.province == this.selectedProvinceCode,
    );

    if (!selectedProvince) return;

    const selectedWard = this.wards.find(
      (w) => w.name == this.selectedWardCode,
    );

    selectedProvince.name = selectedProvince.province;

    this.valueChange.emit({
      province: selectedProvince,
      ward: selectedWard,
    });

    this.singleValueChange.emit({
      province: selectedProvince,
      ward: selectedWard,
    });
  }
}
