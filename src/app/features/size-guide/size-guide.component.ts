import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';

@Component({
    selector: 'app-size-guide',
    standalone: true,
    imports: [CommonModule, SiteHeaderComponent, FooterComponent],
    templateUrl: './size-guide.component.html',
    styleUrl: './size-guide.component.scss'
})
export class SizeGuideComponent {
    activeTab = 'women';

    womenSizes = [
        { size: 'XS', chest: '32-34', waist: '24-26', hips: '34-36', length: '24' },
        { size: 'S', chest: '34-36', waist: '26-28', hips: '36-38', length: '25' },
        { size: 'M', chest: '36-38', waist: '28-30', hips: '38-40', length: '26' },
        { size: 'L', chest: '38-40', waist: '30-32', hips: '40-42', length: '27' },
        { size: 'XL', chest: '40-42', waist: '32-34', hips: '42-44', length: '28' },
        { size: 'XXL', chest: '42-44', waist: '34-36', hips: '44-46', length: '29' }
    ];

    menSizes = [
        { size: 'S', chest: '36-38', waist: '30-32', hips: '36-38', length: '27' },
        { size: 'M', chest: '38-40', waist: '32-34', hips: '38-40', length: '28' },
        { size: 'L', chest: '40-42', waist: '34-36', hips: '40-42', length: '29' },
        { size: 'XL', chest: '42-44', waist: '36-38', hips: '42-44', length: '30' },
        { size: 'XXL', chest: '44-46', waist: '38-40', hips: '44-46', length: '31' }
    ];

    measurementTips = [
        {
            title: 'Chest',
            icon: 'bi-rulers',
            description: 'Measure around the fullest part of your chest, keeping the tape horizontal.'
        },
        {
            title: 'Waist',
            icon: 'bi-circle',
            description: 'Measure around your natural waistline, keeping the tape comfortably loose.'
        },
        {
            title: 'Hips',
            icon: 'bi-square',
            description: 'Stand with feet together and measure around the fullest part of your hips.'
        },
        {
            title: 'Length',
            icon: 'bi-arrows-vertical',
            description: 'Measure from the highest point of shoulder to desired length.'
        }
    ];
}
