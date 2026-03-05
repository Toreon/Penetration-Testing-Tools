import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contribute',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './contribute.html',
  styleUrl: './contribute.scss'
})
export class Contribute {
  readonly templateUrl = 'https://github.com/Toreon/Penetration-Testing-Tools/blob/main/data/tools/tool_template.yml';
  readonly editTemplateUrl = 'https://github.com/Toreon/Penetration-Testing-Tools/edit/main/data/tools/tool_template.yml';
}
