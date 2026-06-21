import useThemeStore from "./store/themeStore"
import AppRoutes from "./routes/AppRoutes"


function App(){

const {theme}=useThemeStore()


return(

<div
className={
theme==="dark"
?
"dark"
:
""
}
>

<AppRoutes/>

</div>

)

}

export default App