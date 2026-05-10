import { EXAM_CONFIGS } from '../lib/exam-config';
import { PredictorPage } from '../components/PredictorPage';

function JeeAdvancedPage() {
  return <PredictorPage config={EXAM_CONFIGS['jee-advanced']} />;
}

export { JeeAdvancedPage };
