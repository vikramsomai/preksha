import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink, SiteHeaderComponent, FooterComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    brandValues = [
        {
            icon: 'bi-heart',
            title: 'Quality First',
            description: 'We source only the finest fabrics and materials for our clothing.'
        },
        {
            icon: 'bi-recycle',
            title: 'Sustainable Fashion',
            description: 'Committed to eco-friendly practices and sustainable manufacturing.'
        },
        {
            icon: 'bi-people',
            title: 'Made in Nepal',
            description: 'Supporting local artisans and preserving traditional craftsmanship.'
        },
        {
            icon: 'bi-shield-check',
            title: 'Customer Trust',
            description: 'Building lasting relationships through honest and reliable service.'
        }
    ];

    milestones = [
        { year: '2020', title: 'Founded', description: 'Preksha Fashion started in Kathmandu' },
        { year: '2021', title: 'Online Launch', description: 'Launched our e-commerce platform' },
        { year: '2022', title: 'Nationwide', description: 'Expanded delivery to all 7 provinces' },
        { year: '2023', title: 'Growing', description: '10,000+ happy customers across Nepal' }
    ];
}
