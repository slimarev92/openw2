import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
    selector: "oww-nav-bar",
    styleUrls: ["./nav-bar.component.scss"],
    template: `
          <nav>
                <div class="logo-and-items-container">
                    <button class="plain-button" (click)="flipItems()">
                        <img id="app-logo" src="assets/images/logo.jpg">
                    </button>
                    <div *ngFor="let item of navItems">{{item}}</div>
                </div>

                <h1>nehama.net</h1>
            </nav>
    `,
    standalone: true,
    imports: [NgFor],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
    private hiddenNavItems = ["items", "settings"]

    protected navItems: string[] = [];

    protected flipItems() {
        const temp = this.hiddenNavItems;

        this.hiddenNavItems = this.navItems;
        this.navItems = temp;
    }
}