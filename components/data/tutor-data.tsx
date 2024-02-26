import { getTutoringData } from "@/actions/db-actions";

const TutorData = async () => {
  const tutoringData = await getTutoringData();
  return <div>TutorData</div>;
};

export default TutorData;
