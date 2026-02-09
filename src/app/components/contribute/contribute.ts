import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contribute',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './contribute.html',
  styleUrl: './contribute.scss'
})
export class Contribute {
}
