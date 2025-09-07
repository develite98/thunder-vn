import { Component } from '@angular/core';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixDialogWrapperComponent } from '@mixcore/ui/dialog';

@Component({
  selector: 'app-create-database-dialog',
  imports: [MixDialogWrapperComponent, MixButtonComponent],
  templateUrl: './create-database-dialog.html',
  styleUrl: './create-database-dialog.css',
})
export class CreateDatabaseDialogComponent {}
