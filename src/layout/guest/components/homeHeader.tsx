import { useNavigate } from "react-router-dom"
import { SiteLogo } from "@/assets/svg/siteLogo"
import styles from "./style.module.css"
import { Button, NavigationMenu, NavigationMenuLink, NavigationMenuList } from "@/components"

export const HomeHeader = () => {
    const navigate = useNavigate();
    return (
        <NavigationMenu className="px-20 py-4 w-full flex justify-between items-center sticky top-0 z-10 bg-[var(--bg)]">
            <div className="flex items-center">
                <SiteLogo />
            </div>
            <NavigationMenuList className={styles.header__list}>
                <NavigationMenuLink
                    href="#home"
                    className={styles.header__item}
                >
                    Bosh sahifa
                </NavigationMenuLink>
                <NavigationMenuLink
                    href='#courses'
                    className={styles.header__item}
                >
                    Kurslar
                </NavigationMenuLink>
                <NavigationMenuLink
                    href='#services'
                    className={styles.header__item}
                >
                    Imkoniyatlar
                </NavigationMenuLink>
                <NavigationMenuLink
                    href="#contact"
                    className={styles.header__item}
                >
                    Biz bilan bo'glanish
                </NavigationMenuLink>
            </NavigationMenuList>
            <div className="flex gap-2.5">
                <Button
                    variant={'outline'}
                    size={'lg'}
                    className="cursor-pointer"
                    onClick={() => { navigate("/login") }}
                >
                    <span className="text-[var(--color-primary)]"> Kirish </span>
                </Button>
                <Button
                    variant={'primary'}
                    size={'lg'}
                >
                    <span>Ro'yxatdan o'tish </span>
                </Button>
            </div>
        </NavigationMenu>
    )
}