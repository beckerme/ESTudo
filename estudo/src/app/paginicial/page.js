import Header from "../../components/Header";
import Input from "../../components/Input";

function page() {
  return (
    <div>
      <Header/>
      <h1>ESTudo</h1>
      <p>university Document-Sharing App</p>
      <Input type="search" />
    </div>
  );
}

export default page;