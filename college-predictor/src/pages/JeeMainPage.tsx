import { EXAM_CONFIGS } from '../lib/exam-config';
import { PredictorPage } from '../components/PredictorPage';

function JeeMainPage() {
  return <PredictorPage config={EXAM_CONFIGS['jee-main']} />;
}

export { JeeMainPage };
